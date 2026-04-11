type Props = {
    value: string;
    onChange: (v: string) => void;
};

export default function TipsInput({ value, onChange }: Props) {
    return (
        <div style={{ position: "sticky", top: 0 }}>
            <label className="form-label">Tips</label>
            <textarea
                className="form-control"
                rows={21}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Template:

username tipped 500 tokens

username tipped 25 tokens
Notice: @username 💰 tipped for → menu item 🥰`}
            />
        </div>
    );
}
