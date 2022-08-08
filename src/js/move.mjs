export class Move {
    static moveList = [
        (pos) => {
            return [pos[0] - 1, pos[1]];
        },
        (pos) => {
            return [pos[0], pos[1] + 1];
        },
        (pos) => {
            return [pos[0] + 1, pos[1] + 1];
        },
        (pos) => {
            return [pos[0] + 1, pos[1]];
        },
        (pos) => {
            return [pos[0], pos[1] - 1];
        },
        (pos) => {
            return [pos[0] - 1, pos[1] - 1];
        },
    ];

    static move(pos, team, i) {
        let index = team + i;
        index = index%6;
        return (Move.moveList.at(index))(pos);
    }

    static topRight(pos, team) {
        return Move.move(pos, team, 0);
    }

    static right(pos, team) {
        return Move.move(pos, team, 1);
    }

    static bottomRight(pos, team) {
        return Move.move(pos, team, 2);
    }

    static bottomLeft(pos, team) {
        return Move.move(pos, team, 3);
    }

    static left(pos, team) {
        return Move.move(pos, team, 4);
    }

    static topLeft(pos, team) {
        return Move.move(pos, team, 5);
    }

    static straight(pos, num) {
        let tileList = [];
        let team = 0;

        for (let k = 0; k < 6; k++) {
            let temp = pos;
            for (let z = 0; z < num; z++) {
                temp = Move.move(temp, team, k);
                tileList.push(temp);
            }

        }

        return tileList;

    }

    static around(pos, num) {
        let tileList = [];
        let team = 0;

        let startPoint = pos;
        for (let k = 0; k < num; k++) {
            startPoint = Move.move(startPoint, team, 0);
        }

        tileList.push(startPoint);

        for (let k = 0; k < 6; k++) {
            for (let z = 0; z < num; z++) {
                tileList.push(Move.move(tileList[num*k + z], team, k+2));
            }
        }

        tileList.splice(0, 1);

        return tileList;
    }
}