export interface Board {
  id: string;
  name: string;
  type: string;
  date: string;
}

export interface TaskBox {
  id: string;
  boardId: string;
  name: string;
}

export interface Task {
  id: string;
  boxId: string;
  title: string;
  order: number;
  status: string;
}
