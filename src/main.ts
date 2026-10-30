export {};

type NoteManagementAction =
  | { type: "add"; id: number; title: string; content: string }
  | { type: "remove"; noteId: number };

class User {
  protected notebooks: NoteBook[] = [];
  protected phone: string;
  private password: string;
  private _age: number = 18;

  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    password: string,
    phone: string,
    age: number
  ) {
    this.password = password;
    this.phone = phone;
    this.age = age;
  }

  public get age(): number {
    return this._age;
  }

  public set age(value: number) {
    if (!Number.isInteger(value) || value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    this._age = value;
  }

  public displayInfo(): void {
    console.log(`Id: ${this.id}`);
    console.log(`Name: ${this.name}`);
    console.log(`Email: ${this.email}`);
    console.log(`Phone: ${this.phone}`);
    console.log(`Age: ${this.age}`);
  }

  public addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }

  public removeNotebook(notebookId: number): boolean {
    const index = this.notebooks.findIndex((notebook) => notebook.id === notebookId);
    if (index === -1) return false;
    this.notebooks.splice(index, 1);
    return true;
  }

  public getNotebooks(): NoteBook[] {
    return [...this.notebooks];
  }
}

class Admin extends User {
  constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
    super(id, name, email, password, phone, age);
  }

  public manageNotes(notebook: NoteBook, action: NoteManagementAction): boolean | void {
    if (action.type === "add") {
      notebook.addNote(action.id, action.title, action.content, this);
      return;
    }
    return notebook.removeNote(action.noteId);
  }
}

class Note {
  constructor(
    public readonly id: number,
    public title: string,
    public content: string,
    public readonly userId: User
  ) {}

  public preview(): string {
    const maxLength = 50;
    if (this.content.length <= maxLength) return this.content;
    return `${this.content.slice(0, maxLength)}...`;
  }

  public getAuthor(): User {
    return this.userId;
  }
}

class NoteBook {
  private notes: Note[];

  constructor(public readonly id: number, public title: string) {
    this.notes = [];
  }

  public addNote(id: number, title: string, content: string, userId: User): Note {
    const note = new Note(id, title, content, userId);
    this.notes.push(note);
    return note;
  }

  public removeNote(noteId: number): boolean {
    const index = this.notes.findIndex((note) => note.id === noteId);
    if (index === -1) return false;
    this.notes.splice(index, 1);
    return true;
  }

  public getAllNotes(): Note[] {
    return [...this.notes];
  }
}

class Storage<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public removeItem(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  public getAllItems(): T[] {
    return [...this.items];
  }
}

const user = new User(1, "Youssef", "youssef@example.com", "password123", "01000000000", 21);
const admin = new Admin(2, "Admin", "admin@example.com", "admin123", "01100000000", 30);
const notebook = new NoteBook(101, "My Notes");

user.addNotebook(notebook);
const note = notebook.addNote(1001, "First Note", "This is the content of my first note.", user);
console.log(note.preview());
user.displayInfo();

admin.manageNotes(notebook, {
  type: "add",
  id: 1002,
  title: "Admin Note",
  content: "This note was added by the admin."
});

const noteStorage = new Storage<Note>();
noteStorage.addItem(note);
console.log(noteStorage.getAllItems());
