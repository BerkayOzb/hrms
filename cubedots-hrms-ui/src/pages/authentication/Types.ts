export interface User {
    firstName: string;
    lastName: string;
    employeeNumber?: string;
    password: string;
    role: "admin" | "hr" | "employee" | undefined;
    email: string;
    phone: string;
    verified?: boolean;
}

export type LoginUser = {
    email: string;
    password: string;
}


export type Token = Partial<User>;
