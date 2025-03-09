interface StatusMessageProps {
    message: string
}
export default function StatusMessage({ message }: StatusMessageProps) {
    return (
        <div className="flex items-center justify-center flex-1 text-center">
            <p>{message}</p>
        </div>
    )
}