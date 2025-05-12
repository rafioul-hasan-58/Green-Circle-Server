"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const idea_route_1 = require("../modules/idea/idea.route");
const blog_route_1 = require("../modules/blog/blog.route");
const vote_route_1 = require("../modules/vote/vote.route");
const comment_route_1 = require("../modules/comment/comment.route");
const payment_route_1 = require("../modules/payment/payment.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.userRouter,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRouter,
    },
    {
        path: "/ideas",
        route: idea_route_1.ideaRouter,
    },
    {
        path: "/blogs",
        route: blog_route_1.blogRouter,
    },
    {
        path: "/votes",
        route: vote_route_1.voteRouter,
    },
    {
        path: "/comments",
        route: comment_route_1.commentRouter,
    },
    {
        path: "/payments",
        route: payment_route_1.paymentRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
