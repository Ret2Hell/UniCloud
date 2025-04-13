/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/graphql": { "models": [[import("./users/dto/create-user.input"), { "CreateUserInput": { username: { type: () => String }, email: { type: () => String }, password: { type: () => String }, access_token: { nullable: true, type: () => String } } }], [import("./users/dto/update-user.input"), { "UpdateUserInput": { user_id: {} } }], [import("./users/entities/user.entity"), { "User": { username: { type: () => String }, email: { type: () => String }, password: { type: () => String }, access_token: { nullable: true, type: () => String }, user_id: {} } }]] } };
};