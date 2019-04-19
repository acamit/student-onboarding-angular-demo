import { User } from "../Entities/User";
let user1 = new User();
user1.id = 1;
user1.firstName = "amit";
user1.lastName = "chawla";
user1.username = "nagarro";
user1.password = "nagarro";

export const Users:User[] = [user1];
