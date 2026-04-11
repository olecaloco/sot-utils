type Props = {
    usermap: Map<string, string[]>;
};

export default function ResultsTable({ usermap }: Props) {
    if (usermap.size === 0) {
        return (
            <table className="table table-hover">
                <tbody>
                    <tr>
                        <td>No items yet. Paste to see updates</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {[...usermap.entries()].map(([user, values]) => {
                    const counts = values.reduce<Record<string, number>>(
                        (acc, item) => {
                            acc[item] = (acc[item] || 0) + 1;
                            return acc;
                        },
                        {},
                    );

                    return (
                        <tr key={user}>
                            <td>{user}</td>
                            <td>
                                {Object.entries(counts).map(([item, count]) => (
                                    <div key={item}>
                                        {item} {count > 1 && `(${count})`}
                                    </div>
                                ))}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
