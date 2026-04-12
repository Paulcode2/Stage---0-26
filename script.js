//  Todo Card Component

class TodoCard {
  constructor() {
    this.card = document.querySelector('[data-testid="test-todo-card"]');
    this.titleElement = document.querySelector(
      '[data-testid="test-todo-title"]',
    );
    this.statusElement = document.querySelector(
      '[data-testid="test-todo-status"]',
    );
    this.checkboxElement = document.querySelector(
      '[data-testid="test-todo-complete-toggle"]',
    );
    this.timeRemainingElement = document.querySelector(
      '[data-testid="test-todo-time-remaining"]',
    );
    this.dueDateElement = document.querySelector(
      '[data-testid="test-todo-due-date"]',
    );
    this.editButton = document.querySelector(
      '[data-testid="test-todo-edit-button"]',
    );
    this.deleteButton = document.querySelector(
      '[data-testid="test-todo-delete-button"]',
    );

    this.init();
  }

  init() {
    this.checkboxElement.addEventListener("change", () =>
      this.toggleComplete(),
    );
    this.editButton.addEventListener("click", () => this.handleEdit());
    this.deleteButton.addEventListener("click", () => this.handleDelete());

    // Initial time calculation
    this.updateTimeRemaining();

    // Update time remaining every 60 seconds
    this.timeUpdateInterval = setInterval(() => {
      this.updateTimeRemaining();
    }, 60000); // 60 seconds

    // Clean up interval on page unload
    window.addEventListener("beforeunload", () => {
      if (this.timeUpdateInterval) {
        clearInterval(this.timeUpdateInterval);
      }
    });
  }

  //  Calculate and update time remaining text
  updateTimeRemaining() {
    const dueDate = new Date(this.dueDateElement.getAttribute("datetime"));
    const now = new Date();
    const diffMs = dueDate - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeText = "";

    if (diffMs < 0) {
      // Overdue
      const absDays = Math.abs(diffDays);
      const absHours = Math.abs(diffHours % 24);
      const absMins = Math.abs(diffMins % 60);

      if (absDays > 0) {
        timeText = `Overdue by ${absDays} day${absDays > 1 ? "s" : ""}`;
      } else if (absHours > 0) {
        timeText = `Overdue by ${absHours} hour${absHours > 1 ? "s" : ""}`;
      } else if (absMins > 0) {
        timeText = `Overdue by ${absMins} minute${absMins > 1 ? "s" : ""}`;
      } else {
        timeText = "Overdue";
      }
    } else {
      // Due in future
      if (diffDays > 0) {
        if (diffDays === 1) {
          timeText = "Due tomorrow";
        } else {
          timeText = `Due in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
        }
      } else if (diffHours > 0) {
        timeText = `Due in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
      } else if (diffMins > 0) {
        timeText = `Due in ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
      } else {
        timeText = "Due now!";
      }
    }

    // Update the element with announce of change to screen readers
    const oldText = this.timeRemainingElement.textContent;
    if (oldText !== timeText) {
      this.timeRemainingElement.textContent = timeText;
    }
  }

  /**
   * Handle checkbox toggle - update title and status
   */
  toggleComplete() {
    const isChecked = this.checkboxElement.checked;

    if (isChecked) {
      this.card.classList.add("completed");
      this.statusElement.textContent = "Done";
      this.statusElement.setAttribute("aria-label", "Task status: Done");
    } else {
      this.card.classList.remove("completed");
      this.statusElement.textContent = "Pending";
      this.statusElement.setAttribute("aria-label", "Task status: Pending");
    }

    console.log(`Task toggled: ${isChecked ? "Completed" : "Pending"}`);
  }

  /**
   * handleEdit
   */
  handleEdit() {
    console.log("Edit clicked");
    alert("This would open an edit modal or form.");
  }

  /**
   * handleDelete
   */
  handleDelete() {
    console.log("Delete clicked");
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      console.log("Task deleted");
      alert("Task deleted");
    }
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }
}

// Initialize the todo card when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const todoCard = new TodoCard();
});
