"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = exports.MovieStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var MovieStatus;
(function (MovieStatus) {
    MovieStatus["COMING_SOON"] = "COMING_SOON";
    MovieStatus["NOW_SHOWING"] = "NOW_SHOWING";
    MovieStatus["ENDED"] = "ENDED";
})(MovieStatus || (exports.MovieStatus = MovieStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["PAID"] = "PAID";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["COMPLETED"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
