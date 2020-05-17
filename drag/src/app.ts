/**
 * autoBind decorator
 * */
function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get(): any {
      return originalMethod.bind(this);
    }
  };

  return adjDescriptor;
}

// /decorator

/**
 * Validation
 * */

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable): boolean {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

/**
 * Project state management
 * */

class ProjectState {
  private projects: any[] = [];
  private listeners: any[] = [];
  private static instance: ProjectState;

  private constructor() {
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(fn: Function) {
    this.listeners.push(fn);
  }

  addProject(title: string, description: string, people: number) {
    const newProject = {
      id: Math.random().toString(),
      title,
      description,
      people
    };

    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// call project state globally
const projectState = ProjectState.getInstance();

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = `${type}-projects`;

    this.attach();

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;

    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    this.element.querySelector('ul')!.id = `${this.type}-project-list`;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  titleElement: HTMLInputElement;
  descriptionElement: HTMLInputElement;
  peopleElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleElement = this.element.querySelector('#people') as HTMLInputElement;
    this.configure();

    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private clearInputs(): void {
    this.titleElement.value = '';
    this.descriptionElement.value = '';
    this.peopleElement.value = '';
  }

  private getUserInputs(): [string, string, number] | void {
    const title = this.titleElement.value.trim();
    const description = this.descriptionElement.value.trim();
    const people = this.peopleElement.value.trim();

    const titleValidatable: Validatable = {
      value: title,
      required: true,
      maxLength: 20
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 10
    };

    if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
      alert('Invalid input!');
      return;
    }

    return [title, description, +people];
  }

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInputs = this.getUserInputs();
    if (Array.isArray(userInputs)) {
      const [title, description, people] = userInputs;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const finishedProjects = new ProjectList('finished');
const activeProjects = new ProjectList('active');