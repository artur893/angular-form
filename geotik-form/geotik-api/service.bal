import ballerina/http;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}

service / on new http:Listener(5001) {

    resource function get users() returns Userdata[] {
        return userDataTable.toArray();
    }

    resource function get users/[int id]() returns json {
        if userDataTable[id] is Userdata {
            return userDataTable[id].toJson();
        } else {
            return {msg: "Nie znaleziono użytkownika"};
        }
    }

    resource function post users(@http:Payload NewUser user) returns json {
        User newUser = new User(userData.length() + 1, user.email, user.password);
        pushToUserData(newUser);
        userDataTable = table [];
        populateUsers();
        return {msg: "Konto zostało utworzone"};
    }

    resource function post users/resetPassword(http:Caller caller,
                                    http:Request request) returns error? {
        string email = check request.getTextPayload();
        User[] filtered = userData.filter(x => x.email == email);
        http:Response resp = new;
        if filtered.length() > 0 {
            resp.setPayload({msg: "Wysłano e-mail z instrukcją zmiany hasła"});
            resp.statusCode = 202;
            check caller->respond(resp);
        } else {
            resp.setPayload({msg: "Nie istnieje użytkowik z danym adresem e-mail"});
            resp.statusCode = 400;
            check caller->respond(resp);
        }
    }

    resource function post auth/login(http:Caller caller, @http:Payload NewUser user) returns error? {
        User[] filtered = userData.filter(x => x.email == user.email);
        http:Response resp = new;
        if filtered.length() > 0 {
            if filtered[0].email == user.email && filtered[0].password == user.password {
                resp.setPayload({msg: "Pomyślnie zalogowano"});
                resp.statusCode = 200;
                check caller->respond(resp);
            } else {
                resp.setPayload({msg: "Hasło nieprawidłowe"});
                resp.statusCode = 401;
                check caller->respond(resp);
            }
        } else {
            resp.setPayload({msg: "Nieprawidłowy e-mail"});
            resp.statusCode = 401;
            check caller->respond(resp);
        }
    }
}

public type NewUser record {
    string email;
    string password;
};

public type Userdata record {
    readonly int id;
    string email;
    string password;
};

public class User {
    int id;
    string email;
    string password;

    public function init(int id, string email, string password) {
        self.id = id;
        self.email = email;
        self.password = password;
    }
}

User user1 = new User(1, "john@gmail.com", "qwert");
User user2 = new User(2, "leonardo@gmail.com", "asdfg");
User user3 = new User(3, "david@gmail.com", "zxcvb");

User[] userData = [user1, user2, user3];

public table<Userdata> key(id) userDataTable = table [
];

function populateUsers() {
    int i = 0;
    foreach User user in userData {
        i = i + 1;
        Userdata data = {id: user.id, email: user.email, password: user.password};
        userDataTable.add(data);
    }
}

function pushToUserData(User user) {
    userData[userData.length()] = user;
}

public function main() {
    populateUsers();
}
