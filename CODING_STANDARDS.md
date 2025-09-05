# Naming Convention Document

## 1. Purpose of Naming Convention

Naming conventions are a cornerstone of writing Clean Code. A well-defined and consistently applied naming convention is crucial for:

- **Readability:** Meaningful names make code self-documenting, reducing the need for excessive comments and making it easier for developers to understand the code's purpose at a glance.
- **Maintainability:** Consistent naming makes it easier to navigate the codebase, refactor code, and onboard new team members. Predictable names reduce cognitive load and the risk of introducing errors.
- **Clarity and Understanding:** Names should clearly communicate the intent and purpose of variables, functions, components, and modules. Ambiguous or misleading names can lead to confusion and bugs.
- **Collaboration and Team Consistency:** A shared naming convention ensures that all team members write code in a consistent style, fostering collaboration and reducing friction during code reviews.
- **Professionalism:** Adhering to established naming conventions is a hallmark of professional software development, signaling attention to detail and code quality.

## 2. General Rules

These general rules apply across all naming conventions in the project:

- **Clarity and Descriptive:**

  - **Intent-Revealing Names:** Choose names that clearly and unambiguously communicate the purpose, role, or functionality of the entity being named. Names should answer the "why" and "what" questions about the code.
  - **Avoid Abbreviations and Acronyms (Unless Widely Understood):** Favor full, descriptive words over abbreviations or acronyms that might be unclear to other developers, especially those new to the project. If abbreviations are necessary, ensure they are widely recognized within the domain.
  - **Example:** Instead of `getData`, use `fetchUserDataFromAPI`. Instead of `btn`, use `submitButton`.

- **Brevity and Completeness:**

  - **Balance Brevity with Clarity:** Strive for names that are concise and easy to type, but not at the expense of clarity. A slightly longer, more descriptive name is preferable to a shorter, ambiguous one.
  - **Context Matters:** The appropriate length of a name can depend on its scope. Variables with a very narrow scope (e.g., within a short function) can sometimes have shorter names, while entities with broader scope should have more descriptive names.
  - **Example:** `user` is acceptable for a variable representing a user in a small function, but `currentUserProfileData` is better for a variable with wider scope or in a component managing user profiles.

- **For Functions, Use Verbs or Verb Phrases:**

  - **Action-Oriented Names:** Function names should clearly indicate the action or operation they perform. Start function names with verbs or verb phrases to emphasize their behavior.
  - **Example:** `calculateTotalPrice()`, `validateUserInput()`, `renderUserProfile()`, `fetchData()`.

- **Consistency:**

  - **Project-Wide Consistency:** Adhere to the established naming conventions throughout the entire project. Inconsistency makes the codebase harder to read and understand.
  - **Team Agreement:** Ensure that the entire development team agrees upon and follows these naming conventions. Use code reviews to enforce consistency.
  - **Example:** If you decide to use `PascalCase` for components, use it consistently for all components, not just some.

- **`camelCase` cho JavaScript/TypeScript (Use `camelCase` for JavaScript/TypeScript):**
  - **JavaScript/TypeScript Convention:** Follow the widely accepted `camelCase` convention for variables, functions, properties, and method names in JavaScript and TypeScript.
  - **Example:** `userName`, `calculateTaxRate()`, `userProfile`, `handleButtonClick()`.

## 3. Naming Conventions by Type

This section details the specific naming conventions for different code elements:

### 3.1. Functions

- **Strong Verbs:** Use strong, action-oriented verbs that clearly describe what the function _does_.
- **`camelCase`:** Follow `camelCase` convention.
- **Prefixes for Specific Function Types:**
  - **Action Handlers:** `handle[EventName]` (PascalCase event name). Used for functions that handle user interactions or events.
    - **Example:** `handleLoginButtonPress`, `handleInputChange`, `handleItemSelect`.
  - **Custom Hooks:** `use[HookName]` (PascalCase hook name). Standard convention for React Hooks.
    - **Example:** `useUserData`, `useFormValidation`, `useTheme`.
  - **Boolean Functions (Predicates):** Start with `is`, `has`, `should`, `can`, `will`, `did` to clearly indicate that the function returns a boolean value (true or false).
    - **Example:** `isValidEmail`, `hasPermission`, `shouldUpdateComponent`, `canAccessResource`, `willComponentUpdate`, `didUserLogin`.
  - **Data Fetching Functions:** Start with `fetch` or `get` to indicate data retrieval operations.
    - **Example:** `fetchUserData`, `getProductsList`, `fetchLatestNews`.
  - **Calculation Functions:** Start with `calculate` to indicate functions performing calculations.
    - **Example:** `calculateTotalPrice`, `calculateTaxAmount`, `calculateDiscount`.
  - **Validation Functions:** Start with `validate` to indicate functions performing data validation.
    - **Example:** `validateEmailFormat`, `validatePasswordStrength`, `validateInputFields`.
  - **Rendering/Display Functions:** Start with `render` to indicate functions responsible for rendering UI elements.
    - **Example:** `renderUserProfileCard`, `renderProductListItems`, `renderErrorMessage`.

### 3.2. Components

- **`PascalCase`:** Use `PascalCase` convention for component names.
- **Describe UI Element or Feature:** Component names should clearly indicate the UI element they represent or the feature they encapsulate.
- **Singular Nouns (Generally Singular Nouns):** Component names are typically singular nouns, representing a single instance of a UI element or feature.
- **Folder Structure Reflects Component Hierarchy:** Organize components in folders that reflect their logical grouping or hierarchy within the UI.
  - **Example:**
    - `Button` (generic button component)
    - `UserProfileCard` (component displaying user profile information)
    - `ProductListItem` (component for a single item in a product list)
    - `LoginScreen` (screen component for the login feature)
    - `HomeHeader` (header component for the home screen)
    - `shared/components/Button` (folder for shared button component)
    - `features/home/components/ProductListItem` (folder for product list item component within the home feature)

### 3.3. Variables

- **`camelCase`:** Use `camelCase` convention for variable names.
- **Describe Purpose and Meaning:** Variable names should clearly indicate what data they hold or represent.
- **Use Nouns or Noun Phrases:** Variable names are typically nouns or noun phrases, representing data or objects.
- **Avoid Single-Letter Variables (Except in Very Short Scopes):** Avoid single-letter variable names (like `i`, `j`, `k`, `a`, `b`, `c`) unless they are used in very short scopes (e.g., loop counters in simple loops). In most cases, more descriptive names are preferred.
- **Boolean Variables:** Use prefixes like `is`, `has`, `should`, `can` for boolean variables to make their purpose clear. \* **Example:** `isLoading`, `isLoggedIn`, `hasError`, `shouldUpdate`, `canEdit`.
- **Collection Variables (Arrays, Lists):** Use plural nouns for variables that hold collections of items. \* **Example:** `users`, `products`, `orderItems`, `errorMessages`.
- **Object Variables:** Use singular nouns or noun phrases describing the object. \* **Example:** `currentUser`, `productDetails`, `formValues`, `apiResponse`.

### 3.4. Constants

- **`UPPER_SNAKE_CASE`:** Use `UPPER_SNAKE_CASE` convention for constant names.
- **Describe Immutable Value:** Constant names should clearly indicate the immutable value they represent.
- **Use Nouns or Noun Phrases:** Constant names are typically nouns or noun phrases, representing fixed values.
- **Example:**
  - `API_BASE_URL`
  - `MAX_USERNAME_LENGTH`
  - `DEFAULT_THEME_COLOR`
  - `NUMBER_OF_ITEMS_PER_PAGE`
  - `LOCAL_STORAGE_TOKEN_KEY`

### 3.5. Types/Interfaces

- **`PascalCase`:** Use `PascalCase` convention for type and interface names.
- **Describe Data Structure:** Type and interface names should clearly describe the structure of the data they represent.
- **Use Nouns or Noun Phrases:** Type and interface names are typically nouns or noun phrases, representing data structures or contracts.
- **Suffixes (Optional but Recommended):**
  - `Type`: For type aliases (e.g., `UserType`, `ProductListType`).
  - `Interface`: For interfaces (e.g., `UserProfileInterface`, `APIResponseInterface`).
  - `Model`: For data models representing data from APIs or databases (e.g., `UserModel`, `ProductModel`).
  - `DTO`: For Data Transfer Objects (e.g., `LoginRequestDTO`, `UserResponseDTO`).
  - `Entity`: For Domain Entities (e.g., `UserEntity`, `OrderEntity`).
  - **Example:**
    - `UserType`
    - `UserProfileInterface`
    - `ProductModel`
    - `LoginRequestDTO`
    - `OrderEntity`

### 3.6. Enums

- **`PascalCase` (Enum Name):** Use `PascalCase` for the enum name itself.
- **`UPPER_SNAKE_CASE` (Enum Values):** Use `UPPER_SNAKE_CASE` for the individual enum values.
- **Describe Set of Meaningful Values:** Enum names and values should clearly describe the set of related values they represent.
- **Example:**

  ```typescript
  enum UserRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER',
  }

  enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
  }
  ```

### 3.7. Files

- **`kebab-case` (or `camelCase`):** Use `kebab-case` (recommended for consistency with React Native ecosystem and URLs) or `camelCase` for file names.
- **Describe File Content:** File names should clearly indicate the primary content or purpose of the file.
- **Feature-Based Grouping:** Organize files within feature folders to reflect the features they belong to.
  - **Example:**
    - `user-profile-card.js` (or `UserProfileCard.js` if using PascalCase for files - less common)
    - `login-screen.js` (or `LoginScreen.js`)
    - `use-user-data.js` (or `useUserData.js`)
    - `home-api.js` (or `HomeApi.js`)
    - `product-list-item.js` (or `ProductListItem.js`)

### 3.8. Folders

- **`camelCase` (or `PascalCase`):** Use `camelCase` (more common in JavaScript/React Native) or `PascalCase` for folder names.
- **Describe Module or Layer:** Folder names should clearly indicate the module, feature, or layer they contain.
- **Logical Grouping:** Group folders logically based on features, layers, or component types.
  - **Example:**
    - `components` (for shared UI components)
    - `screens` (for screen components)
    - `viewmodels` (for ViewModels/Hooks)
    - `data` (for Data Layer code)
    - `domain` (for Domain Layer code)
    - `home` (for the Home feature module)
    - `login` (for the Login feature module)
    - `utils` (for utility functions)
    - `constants` (for project-wide constants)

### 3.9. Style Names

- ** `camelCase` ** Use `camelCase` for style names in React Native StyleSheet objects. Choose one and be consistent.
- **Describe Style Purpose:** style names should clearly indicate the UI element or style they are applied to.
- **Semantic and Meaningful Names:** Use semantic names that reflect the purpose or function of the style, rather than purely presentational names.
  - **Example:**
    - `containerStyle`
    - `headerText`
    - `submitButton`
    - `productListItemContainer`
    - `errorMessage`

## 4. Examples

Here are some examples demonstrating the naming conventions in practice:

```typescript
// --- Functions ---
const fetchUserProfile = async (userId: string): Promise<UserProfileType> => {
  /* ... */
};
const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  /* ... */
};
const useThemeSettings = () => {
  /* ... */
};
const isUserAdmin = (user: UserType): boolean => {
  /* ... */
};

// --- Components ---
const UserProfileCard: React.FC<UserProfileCardProps> = () => {
  /* ... */
};
const ProductList: React.FC<ProductListProps> = () => {
  /* ... */
};
const LoginForm: React.FC = () => {
  /* ... */
};

// --- Variables ---
const userName = 'John Doe';
const productPrice = 99.99;
const isLoadingData = false;
const errorMessages: string[] = [];
const currentUserProfile: UserProfileType = {
  /* ... */
};

// --- Constants ---
const API_ENDPOINT_USERS = '/api/users';
const MAX_PASSWORD_LENGTH = 20;
const DEFAULT_FONT_SIZE = 16;

// --- Types/Interfaces ---
interface UserType {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface ProductListProps {
  products: ProductModel[];
  onAddToCart: (productId: number) => void;
}

// --- Enums ---
enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

// --- Files ---
// features/home/screens/homeScreen.js
// shared/components/button/button.js
// infrastructure/api/userApi.js

// --- Folders ---
// src/features/login/components/
// src/shared/utils/
// src/domain/entities/

// --- CSS Class Names/Style Names ---
// style.js file:
const styles = StyleSheet.create({
  containerStyle: {
    /* ... */
  },
  headerTextStyle: {
    /* ... */
  },
  submitButtonStyle: {
    /* ... */
  },
});
// className in JSX:
<View style={styles.containerStyle}>
  <Text style={styles.headerTextStyle}>...</Text>
  <Button style={styles.submitButtonStyle} title="Submit" />
</View>;
```
