import { create } from "zustand";

type UsersState = {
  users: SocketUser[];
  rooms: Room[];
  me: SocketUser | undefined;
  selectedUser: SocketUser | undefined;
  selectedRoom: Room | undefined;
  setUsers: (users: SocketUser[]) => void;
  setMe: (data: SocketUser | undefined) => void;
  selectRoom: (room: Room) => void;
  selectUser: (user: SocketUser) => void;
  setRooms: (rooms: Room[]) => void;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  selectedRoom: undefined,
  selectedUser: undefined,
  users: [],
  rooms: [],
  me: undefined,

  selectRoom: (room: Room) => {
    const { selectedRoom } = get()
    set({
      selectedUser: undefined,
      selectedRoom: selectedRoom?.id === room.id ? undefined : room,
    })
  },
  selectUser: (user: SocketUser) => {
    const { selectedUser } = get()
    set({
      selectedRoom: undefined,
      selectedUser: selectedUser?.userId === user.userId ? undefined : user
    })
  },
  setUsers: (users) => {
    set({ users })
  },
  setRooms: (rooms) => {
    set({ rooms })
  },
  setMe: (me) => {
    set({ me })
  }
}));
