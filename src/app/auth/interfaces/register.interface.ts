import { BaseAuth } from "./base/base-auth.interface";

export interface Register extends BaseAuth{
    fullName: string;
}