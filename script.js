//  Todo Card Component - Stage 1

class TodoCard {
  constructor() {
    // DOM Elements
    this.card = document.querySelector('[data-testid="test-todo-card"]');
    this.cardNormalView = document.getElementById("cardNormalView");
    this.cardEditView = document.getElementById("cardEditView");

    // Normal view elements
    this.titleElement = document.querySelector(
      '[data-testid="test-todo-title"]',
    );
    this.priorityElement = document.querySelector(
      '[data-testid="test-todo-priority"]',
    );
    this.priorityIndicator = document.querySelector(
      '[data-testid="test-todo-priority-indicator"]',
    );
    this.statusControl = document.querySelector(
      '[data-testid="test-todo-status-control"]',
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
    this.descriptionElement = document.querySelector(
      '[data-testid="test-todo-description"]',
    );
    this.collapsibleSection = document.querySelector(
      '[data-testid="test-todo-collapsible-section"]',
    );
    this.expandToggle = document.querySelector(
      '[data-testid="test-todo-expand-toggle"]',
    );
    this.overdueIndicator = document.querySelector(
      '[data-testid="test-todo-overdue-indicator"]',
    );
    this.editButton = document.querySelector(
      '[data-testid="test-todo-edit-button"]',
    );
    this.deleteButton = document.querySelector(
      '[data-testid="test-todo-delete-button"]',
    );

    // Edit form elements
    this.editForm = document.querySelector(
      '[data-testid="test-todo-edit-form"]',
    );
    this.editTitleInput = document.querySelector(
      '[data-testid="test-todo-edit-title-input"]',
    );
    this.editDescriptionInput = document.querySelector(
      '[data-testid="test-todo-edit-description-input"]',
    );
    this.editPrioritySelect = document.querySelector(
      '[data-testid="test-todo-edit-priority-select"]',
    );
    this.editDueDateInput = document.querySelector(
      '[data-testid="test-todo-edit-due-date-input"]',
    );
    this.saveButton = document.querySelector(
      '[data-testid="test-todo-save-button"]',
    );
    this.cancelButton = document.querySelector(
      '[data-testid="test-todo-cancel-button"]',
    );

    // State
    this.state = {
      title: this.titleElement.textContent.trim(),
      description: this.descriptionElement.textContent.trim(),
      priority: this.priorityElement.textContent.trim(),
      status: this.statusControl.value,
      dueDate: this.dueDateElement.getAttribute("datetime"),
      isCompleted: this.checkboxElement.checked,
      isExpanded: false,
      isEditing: false,
    };

    this.init();
  }

  init() {
    // Event listeners
    this.checkboxElement.addEventListener("change", () =>
      this.handleCheckboxToggle(),
    );
    this.statusControl.addEventListener("change", () =>
      this.handleStatusChange(),
    );
    this.editButton.addEventListener("click", () => this.enterEditMode());
    this.saveButton.addEventListener("click", (e) => this.handleSave(e));
    this.cancelButton.addEventListener("click", () => this.exitEditMode());
    this.expandToggle.addEventListener("click", () => this.toggleDescription());

    // Initial setup
    this.updateTimeRemaining();
    this.updatePriorityIndicator();
    this.checkDescriptionLength();
    this.syncStatusWithCheckbox();

    // Update time every 30-60 seconds (random interval)
    this.startTimeUpdateInterval();

    // Close edit mode on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.state.isEditing) {
        this.exitEditMode();
      }
    });

    // Clean up on page unload
    window.addEventListener("beforeunload", () => {
      this.cleanup();
    });
  }

  /**
   * Start time update interval (every 30-60 seconds)
   */
  startTimeUpdateInterval() {
    const randomInterval = 30000 + Math.random() * 30000; // 30-60 seconds
    this.timeUpdateInterval = setInterval(() => {
      this.updateTimeRemaining();
    }, randomInterval);
  }

  /**
   * Calculate and update time remaining
   */
  updateTimeRemaining() {
    // If status is Done, show "Completed"
    if (this.state.status === "Done" || this.state.isCompleted) {
      this.timeRemainingElement.textContent = "Completed";
      this.overdueIndicator.classList.remove("show");
      return;
    }

    const dueDate = new Date(this.state.dueDate);
    const now = new Date();
    const diffMs = dueDate - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeText = "";
    let isOverdue = false;

    if (diffMs < 0) {
      // Overdue
      isOverdue = true;
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

    // Update time element
    const oldText = this.timeRemainingElement.textContent;
    if (oldText !== timeText) {
      this.timeRemainingElement.textContent = timeText;
    }

    // Update overdue indicator
    if (isOverdue && this.state.status !== "Done") {
      this.overdueIndicator.textContent = "🔴 OVERDUE";
      this.overdueIndicator.classList.add("show");
      this.timeRemainingElement.classList.add("overdue");
    } else {
      this.overdueIndicator.classList.remove("show");
      this.timeRemainingElement.classList.remove("overdue");
    }
  }

  /**
   * Check if description is long enough to collapse
   */
  checkDescriptionLength() {
    const maxLines = 3;
    const lineHeight = 24; // Approximate in pixels
    const maxHeight = maxLines * lineHeight;

    if (this.collapsibleSection.scrollHeight > maxHeight) {
      this.expandToggle.style.display = "flex";
      this.collapsibleSection.classList.remove("expanded");
      this.expandToggle.setAttribute("aria-expanded", "false");
    } else {
      this.expandToggle.style.display = "none";
      this.collapsibleSection.classList.add("expanded");
    }
  }

  /**
   * Toggle description expand/collapse
   */
  toggleDescription() {
    const isExpanded =
      this.expandToggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      this.collapsibleSection.classList.remove("expanded");
      this.expandToggle.setAttribute("aria-expanded", "false");
      this.expandToggle.querySelector(".toggle-text").textContent = "Show more";
    } else {
      this.collapsibleSection.classList.add("expanded");
      this.expandToggle.setAttribute("aria-expanded", "true");
      this.expandToggle.querySelector(".toggle-text").textContent = "Show less";
    }
  }

  /**
   * Handle checkbox toggle
   */
  handleCheckboxToggle() {
    const isChecked = this.checkboxElement.checked;

    if (isChecked) {
      this.state.isCompleted = true;
      this.state.status = "Done";
      this.statusControl.value = "Done";
    } else {
      this.state.isCompleted = false;
      this.state.status = "Pending";
      this.statusControl.value = "Pending";
    }

    this.syncStatusWithCheckbox();
    this.updateTimeRemaining();
  }

  /**
   * Handle status control change
   */
  handleStatusChange() {
    const newStatus = this.statusControl.value;
    this.state.status = newStatus;

    // Update checkbox based on status
    if (newStatus === "Done") {
      this.checkboxElement.checked = true;
      this.state.isCompleted = true;
    } else {
      this.checkboxElement.checked = false;
      this.state.isCompleted = false;
    }

    this.syncStatusWithCheckbox();
    this.updateTimeRemaining();
  }

  /**
   * Sync visual state with status and checkbox
   */
  syncStatusWithCheckbox() {
    if (this.state.status === "Done" || this.state.isCompleted) {
      this.card.classList.add("completed");
    } else {
      this.card.classList.remove("completed");
    }
  }

  /**
   * Update priority indicator color
   */
  updatePriorityIndicator() {
    const priority = this.state.priority.toLowerCase();

    // Remove all priority classes
    this.card.classList.remove(
      "priority-high",
      "priority-medium",
      "priority-low",
    );
    this.priorityIndicator.classList.remove("high", "medium", "low");
    this.priorityElement.classList.remove("medium", "low");

    // Add appropriate classes
    if (priority === "high") {
      this.card.classList.add("priority-high");
      this.priorityIndicator.classList.add("high");
    } else if (priority === "medium") {
      this.card.classList.add("priority-medium");
      this.priorityIndicator.classList.add("medium");
      this.priorityElement.classList.add("medium");
    } else if (priority === "low") {
      this.card.classList.add("priority-low");
      this.priorityIndicator.classList.add("low");
      this.priorityElement.classList.add("low");
    }
  }

  /**
   * Enter edit mode
   */
  enterEditMode() {
    this.state.isEditing = true;

    // Populate form with current data
    this.editTitleInput.value = this.state.title;
    this.editDescriptionInput.value = this.state.description;
    this.editPrioritySelect.value = this.state.priority;

    // Convert datetime to local datetime input format
    const date = new Date(this.state.dueDate);
    const localDateTime = date.toISOString().slice(0, 16);
    this.editDueDateInput.value = localDateTime;

    // Switch views
    this.cardNormalView.classList.add("hidden");
    this.cardEditView.classList.add("active");

    // Focus on title input
    setTimeout(() => this.editTitleInput.focus(), 0);
  }

  /**
   * Exit edit mode without saving
   */
  exitEditMode() {
    this.state.isEditing = false;

    // Switch views
    this.cardNormalView.classList.remove("hidden");
    this.cardEditView.classList.remove("active");

    // Return focus to edit button
    setTimeout(() => this.editButton.focus(), 0);
  }

  /**
   * Handle form save
   */
  handleSave(e) {
    e.preventDefault();

    // Validate form
    if (!this.editTitleInput.value.trim()) {
      alert("Title is required");
      return;
    }

    // Update state
    this.state.title = this.editTitleInput.value.trim();
    this.state.description = this.editDescriptionInput.value.trim();
    this.state.priority = this.editPrioritySelect.value;

    // Handle date conversion
    const dateInput = this.editDueDateInput.value;
    if (dateInput) {
      const date = new Date(dateInput);
      this.state.dueDate = date.toISOString();
    }

    // Update DOM
    this.titleElement.textContent = this.state.title;
    this.descriptionElement.textContent = this.state.description;
    this.collapsibleSection.style.display = "block"; // Ensure it's visible for re-measurement
    this.priorityElement.textContent = this.state.priority;
    this.dueDateElement.setAttribute("datetime", this.state.dueDate);

    // Format due date for display
    const displayDate = new Date(this.state.dueDate).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "short", day: "numeric" },
    );
    this.dueDateElement.textContent = `Due ${displayDate}`;

    // Update visual indicators
    this.updatePriorityIndicator();
    this.checkDescriptionLength();
    this.updateTimeRemaining();

    // Exit edit mode
    this.exitEditMode();

    console.log("Task updated:", this.state);
  }

  /**
   * Cleanup
   */
  cleanup() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }

  /**
   * Destroy component
   */
  destroy() {
    this.cleanup();
    this.checkboxElement.removeEventListener("change", () =>
      this.handleCheckboxToggle(),
    );
    this.statusControl.removeEventListener("change", () =>
      this.handleStatusChange(),
    );
    this.editButton.removeEventListener("click", () => this.enterEditMode());
    this.saveButton.removeEventListener("click", (e) => this.handleSave(e));
    this.cancelButton.removeEventListener("click", () => this.exitEditMode());
    this.expandToggle.removeEventListener("click", () =>
      this.toggleDescription(),
    );
  }
}

// Initialize the todo card when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const todoCard = new TodoCard();
});
