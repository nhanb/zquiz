const std = @import("std");
const ws = @import("websocket");
const io = @import("io");

const RpcMethod = enum {
    get_quizzes,
    create_room,
};

const RpcRequest = struct {
    method: []u8,
    id: []u8,
    params: struct {},
};

const Quiz = struct {
    name: []const u8,
    id: []const u8,
    questions: []const Question,
};

const Question = struct {
    question: []const u8,
    options: [4][]const u8,
    answer: u8,
};

const RpcResponseTag = enum { quizzes, roomId };

const RpcResponse = struct {
    id: []u8,
    data: union(RpcResponseTag) {
        quizzes: []const Quiz,
        roomId: []const u8,
    },
};

const quizzes: []const Quiz = &.{
    .{
        .name = "Quiz 1",
        .id = "q1",
        .questions = &.{
            .{
                .question = "How many legs does a normal dog have?",
                .options = .{
                    "One",
                    "Two",
                    "Three",
                    "Four",
                },
                .answer = 0,
            },
            .{
                .question = "1 + 1 = ?",
                .options = .{
                    "1",
                    "2",
                    "3",
                    "4",
                },
                .answer = 1,
            },
        },
    },
    .{
        .name = "Quiz 2",
        .id = "q2",
        .questions = &.{
            .{
                .question = "Why does the chicken cross the road?",
                .options = .{
                    "How should I know?",
                    "One",
                    "Five",
                    "Four",
                },
                .answer = 0,
            },
        },
    },
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var server = try ws.Server(Handler).init(allocator, .{
        .port = 8001,
        .address = "127.0.0.1",
        .handshake = .{
            .timeout = 3,
            .max_size = 1024,
            // since we aren't using hanshake.headers
            // we can set this to 0 to save a few bytes.
            .max_headers = 0,
        },
    });

    // Arbitrary (application-specific) data to pass into each handler
    // Pass void ({}) into listen if you have none
    var app = App{};

    // this blocks
    try server.listen(&app);
}

// This is your application-specific wrapper around a websocket connection
const Handler = struct {
    app: *App,
    conn: *ws.Conn,

    // You must define a public init function which takes
    pub fn init(h: ws.Handshake, conn: *ws.Conn, app: *App) !Handler {
        // `h` contains the initial websocket "handshake" request
        // It can be used to apply application-specific logic to verify / allow
        // the connection (e.g. valid url, query string parameters, or headers)

        _ = h; // we're not using this in our simple case

        return .{
            .app = app,
            .conn = conn,
        };
    }

    // You must defined a public clientMessage method
    pub fn clientMessage(self: *Handler, allocator: std.mem.Allocator, data: []const u8) !void {
        const parsed = try std.json.parseFromSlice(RpcRequest, allocator, data, .{});
        defer parsed.deinit();
        const request = parsed.value;
        if (std.mem.eql(u8, request.method, "get_quizzes")) {
            var wb = self.conn.writeBuffer(allocator, .text);
            try std.json.stringify(
                RpcResponse{
                    .id = request.id,
                    .data = .{ .quizzes = quizzes },
                },
                .{},
                wb.writer(),
            );
            try wb.flush();
        } else if (std.mem.eql(u8, request.method, "create_room")) {
            var wb = self.conn.writeBuffer(allocator, .text);
            try std.json.stringify(
                RpcResponse{
                    .id = request.id,
                    .data = .{ .roomId = "TODO" },
                },
                .{},
                wb.writer(),
            );
            try wb.flush();
        } else {
            std.debug.print("Unrecognized method: {s}", .{request.method});
        }
    }
};

// This is application-specific you want passed into your Handler's
// init function.
const App = struct {
    // maybe a db pool
    // maybe a list of rooms
};
