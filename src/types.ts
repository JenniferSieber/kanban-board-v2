export type Id = string | number;

export type Column = {
    id: Id;
    title: string;
}

export type Task = {
    id: Id;
    columnId: Id;
    content: string;
}

export type Member = {
    id: Id;
    memberName: string;
}
// export type ProjectTitle = {
//     name: string;
// }