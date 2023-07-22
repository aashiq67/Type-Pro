class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
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
        this.queue.map((room, idx) => {
            if (room.roomMembers.some((member) => member.sockId === sockId)) {
                room.roomMembers = room.roomMembers.filter((member) => member.sockId !== sockId);
                index = idx
            }
            return room;
        });
        return this.queue[index]
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    size() {
        return this.queue.length;
    }
}

module.exports = PriorityQueue;