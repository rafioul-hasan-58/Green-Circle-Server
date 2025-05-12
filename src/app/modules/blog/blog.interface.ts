
export interface IBlog {
    title: string,
    images: string[],
    description: string,
    authorId: string,
    category: "energy" | "waste" | "transportation"
}

export type TBlogFilterRequest = {
    searchTerm?: string | undefined;
    title?: string | undefined;
    status?: string | undefined;
    up_votes?: string | undefined;
    down_votes?: string | undefined;
    author?: string | undefined;
};