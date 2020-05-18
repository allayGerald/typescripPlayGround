import {Component} from './base-component.js'
import {projectState} from '../state/project-state.js'
import {Validatable, validate} from '../util/validation.js'
import {autoBind} from '../decorators/autobind.js'

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleElement: HTMLInputElement;
    descriptionElement: HTMLInputElement;
    peopleElement: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, 'user-input');

      this.titleElement = this.element.querySelector('#title') as HTMLInputElement;
      this.descriptionElement = this.element.querySelector('#description') as HTMLInputElement;
      this.peopleElement = this.element.querySelector('#people') as HTMLInputElement;

      this.configure();
    }

    configure() {
      this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent() {
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