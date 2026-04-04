export interface LayoutProps {
    children?: React.ReactNode;
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
    return <div className="root-content">
        {children}
    </div>
}
