'use client'
import CollapsibleMenu from "@/components/CollapsibleMenu";
import InstallPrompt from "@/components/InstallPrompt";
import SearchButton from "@/components/SearchButton";
import StatusMessage from "@/components/StatusMessage";
import UserRepos from "@/components/UserRepos";
import { GitHubRepository, UserResponse, UserWithRepos } from "@/lib/interface/interface";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const fetchUsersWithRepos = async (username: string) => {
	const response = await fetch(`https://api.github.com/search/users?q=${username}&per_page=5`);
	// const response = await fetch(`https://api.github.com/rate_limit`);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "User not found");
	}
	const data: UserResponse = await response.json();
	const users = data.items;

	const userWithRepos = await Promise.all(
		users.map(async (user) => {
			const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`);
			if (!reposResponse.ok) {
				const errorRepos = await reposResponse.json();
				throw new Error(errorRepos.message || "Failed to fetch repositories");
			}
			const dataRepos: GitHubRepository[] = await reposResponse.json();
			return {
				user: {
					login: user.login,
					avatar_url: user.avatar_url,
					profile_url: user.html_url,
				},
				repositories: dataRepos.map(repo => ({
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
	const [hasSearched, setHasSearched] = useState(false);


	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["usersWithRepos", username],
		queryFn: () => fetchUsersWithRepos(username),
		enabled: false, // Don't fetch until button is clicked
	});

	useEffect(() => {
		if (data)
			setUserRepos(data)
	}, [data])

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			if (!username) return;
			handleSearch()
		}
	};

	const handleSearch = () => {
		if (!username) return;
		refetch(); // Manually trigger the query
		setUserRepos([])
		setHasSearched(true)
	};


	const handleToggle = (id: string) => {
		setOpenId((prev) => (prev === id ? null : id));
	};

	const getStatusMessage = () => {
		if (error) return "Error: At least it's not a rejection email this time.";
		if (isLoading) return "Retrieving results... hopefully not another rejection.";
		if (!hasSearched) return "Please enter a user for search.";
		if (username && !isLoading && !error && hasSearched && usersRepos?.length === 0) return "No data found. Just like my job offers.";
		return null;
	};

	const statusMessage = getStatusMessage();
	return (
		<div className="p-4 space-y-2  flex flex-col min-h-screen">
			<input onKeyDown={handleKeyDown} onChange={(e) => setUsername(e.target.value)} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " placeholder="Enter Username" required />
			<SearchButton disabled={!username} onClick={handleSearch} isLoading={isLoading} />
			{statusMessage && <StatusMessage message={statusMessage} />}

			{usersRepos?.length > 0 &&
				usersRepos?.map((user) => (
					<UserRepos
						key={user.user.login}
						user={user}
						openId={openId}
						handleToggle={handleToggle}
					/>
				))}
			{/* <InstallPrompt /> */}
		</div >
	);
}
