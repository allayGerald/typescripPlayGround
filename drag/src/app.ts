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

  private configure(){
    this.element.addEventListener('submit', this.submitHandler);
  }

  @autoBind
  private submitHandler(event: Event){
    event.preventDefault();
    console.log(this.titleElement.value);
  }
}

const prjInput = new ProjectInput();