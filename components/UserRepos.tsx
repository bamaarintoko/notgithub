
import { UserWithRepos } from "@/lib/interface/interface";
import CollapsibleMenu from "./CollapsibleMenu";
import RepositoryItem from "./RespositoryItem";

interface UserReposProps {
    user: UserWithRepos;
    openId: string | null;
    handleToggle: (id: string) => void;
}

export default function UserRepos({ user, openId, handleToggle }: UserReposProps) {
    return (
        <CollapsibleMenu
            key={user.user.login}
            id={user.user.login}
            title={user.user.login}
            isOpen={openId === user.user.login}
            onClick={() => handleToggle(user.user.login)}
        >
            {user.repositories.length > 0 ? (
                user.repositories.map((repos, y) => <RepositoryItem key={y} title={repos.title} description={repos.description || ""} stargazers_count={repos.stargazers_count} />)
            ) : (
                <div className="bg-gray-300 py-2 px-3">No repositories</div>
            )}
        </CollapsibleMenu>
    )
}