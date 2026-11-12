import type {JSX} from "react";

interface TestComponentProps {
    title: string;
    description: string;
}

export function TestComponent({ title, description }: TestComponentProps): JSX.Element {
    return (
        <div className="test-component">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}