class PriorityQueue {
    constructor() {
        this.queue = [];
        const capacity = 1000
    }

    enqueue(item) {
        if(this.queue.length === 1000)
            return undefined
        this.queue.push(item);
    }

    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.queue.shift();
    }

    removeBack() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.queue.pop();
    }

    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.queue[this.queue.length-1];
    }

    addUser(username, sockId) {
        if (this.isEmpty()) {
            return undefined;
        }
        this.queue[this.queue.length - 1].roomMembers.push({sockId, username});
    }

    removeUser(sockId) {
        if (this.isEmpty()) {
            return undefined;
        }
        let index = -1;
        // console.log("tqbf", this.queue);
        this.queue = this.queue.map((room, idx) => {
            if (room.roomMembers.some((member) => member.sockId === sockId)) {
                room.roomMembers = room.roomMembers.filter((member) => member.sockId !== sockId);
                index = idx
            }
            return room;
        })
        .filter((room) => room.roomMembers.length > 0);
        console.log(index);
        // console.log("tqaf", this.queue);
        return this.queue[index]
    }

    startGame() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.queue[this.queue.length - 1].isGameStarted = true;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    size() {
        return this.queue.length;
    }
}

module.exports = PriorityQueue;