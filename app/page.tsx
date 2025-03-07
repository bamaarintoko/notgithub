'use client'
import CollapsibleMenu from "@/components/CollapsibleMenu";
import InstallPrompt from "@/components/InstallPrompt";
import SearchButton from "@/components/SearchButton";
import { GitHubRepository, UserResponse, UserWithRepos } from "@/lib/interface/interface";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const fetchUsersWithRepos = async (username: string) => {
	const response = await fetch(`https://api.github.com/search/users?q=${username}&per_page=5`);
	if (!response.ok) throw new Error("User not found");

	const data: UserResponse = await response.json();
	const users = data.items;

	const userWithRepos = await Promise.all(
		users.map(async (user) => {
			const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`);
			const dataRepos: GitHubRepository[] = await reposResponse.json();
			console.log("dataRepos : ", dataRepos)
			return {
				user: {
					login: user.login,
					avatar_url: user.avatar_url,
					profile_url: user.html_url,
				},
				repositories: dataRepos.slice(0, 5).map(repo => ({
					title: repo.name,
					description: repo.description || "No description",
					stargazers_count: repo.stargazers_count
				})),
			};
		})
	);

	return userWithRepos;
};

export default function Home() {
	const [openId, setOpenId] = useState<string | null>(null);

	const [username, setUsername] = useState<string>("")
	const [usersRepos, setUserRepos] = useState<UserWithRepos[]>([])

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["usersWithRepos", username],
		queryFn: () => fetchUsersWithRepos(username),
		enabled: false, // Don't fetch until button is clicked
	});

	useEffect(() => {
		console.log("error : ", error)
	}, [error])
	useEffect(() => {
		if (data)
			setUserRepos(data)
		console.log("data : ", data)
	}, [data])

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			if (!username) return;
			refetch()
			setUserRepos([])
			// console.log("Enter ditekan, nilai input:");
		}
	};

	const handleSearch = () => {
		if (!username) return;
		refetch(); // Manually trigger the query
		setUserRepos([])
	};


	const handleToggle = (id: string) => {
		setOpenId((prev) => (prev === id ? null : id));
	};

	return (
		<div className="p-4 space-y-2  flex flex-col min-h-screen">
			<input onKeyDown={handleKeyDown} onChange={(e) => setUsername(e.target.value)} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " placeholder="Enter Username" required />
			<SearchButton disabled={!username} onClick={handleSearch} isLoading={isLoading}/>
			{
				error
				&&
				<div className="flex items-center justify-center flex-1">
					Error: At least its not a rejection email this time.
				</div>
			}
			{
				isLoading
				&&
				<div className="flex items-center justify-center flex-1 ">
					Retrieving results... hopefully not another rejection.
				</div>
			}
			{
				!isLoading && !error &&
				usersRepos.length < 1
				&&
				<div className="flex items-center justify-center flex-1 ">
					No data found. Just like my job offers.
				</div>
			}
			{
				usersRepos.map((x, y) => (

					<CollapsibleMenu
						key={y}
						id={String(x.user.login)}
						title={String(x.user.login)}
						isOpen={openId===x.user.login}
						onClick={handleToggle}
					>
						{
							x.repositories.length > 0 &&
							x.repositories.map((i, j) => (
								<div key={j} className="bg-gray-300 py-2 px-3">
									<div className="flex">

										<p className="text-lg font-bold w-0 flex-1 min-w-0 break-words">{i.title}</p>
										<div className="ml-auto flex items-center justify-center">

											<p className="text-sm ">{i.stargazers_count}</p>
											<svg className="w-3.5 h-3.5 text-gray-800 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
												<path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
											</svg>

										</div>
									</div>
									<p>{i.description || "-"}</p>
								</div>
							))
						}
						{
							x.repositories.length < 1
							&&
							<div className="bg-gray-300 py-2 px-3">
								no repositories
							</div>
						}
					</CollapsibleMenu>
				))

			}
			<InstallPrompt/>
		</div>
	);
}
