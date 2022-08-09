export class Nickname {

    #socket;
    #nickname = '';

    constructor(_socket) {
        this.#socket = _socket;
    }

    #checkNickname() {
        const cookie = document.cookie;
        if (cookie === '') {
            return false;
        } else {
            return true;
        }
    }

    setNickname() {
        if (!this.#checkNickname()) {
            while (this.#nickname.match(/[가-힣]{2,4}/) === null) {
                this.#nickname = prompt('이름을 입력하세요.');
            }
            document.cookie = this.#nickname;
        } else {
            this.#nickname = document.cookie;
        }

        this.#socket.emit('setNickName', this.#nickname);
    }

    getNickname() {
        return this.#nickname;
    }
}