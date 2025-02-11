import { Middleware } from "polymatic";

export class HelpPage extends Middleware {
  closeButton: HTMLElement | null = null;
  contentModal: HTMLDialogElement | null = null;

  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("deactivate", this.handleDeactivate);
  }

  setup() {
    // setup only once
    if (this.contentModal) return;

    this.contentModal = document.querySelector<HTMLDialogElement>("dialog#help-content");

    if (!this.contentModal){
      console.log("help-content dialog element not found");
      return
    };
 
    this.closeButton = this.closeButton ?? document.createElement("button");
    this.closeButton.ariaLabel = "close";
    this.closeButton.textContent = "✕";
    this.contentModal.appendChild(this.closeButton);

    this.closeButton.addEventListener("click", this.handleCloseModal);
  }

  handleActivate = () => {
    this.setup();
    this.contentModal.showModal();
  };

  handleDeactivate = () => {
    this.contentModal.close();
  };

  handleCloseModal = () => {
    this.emit("page-set", { name: "home-page" });
  };
}
