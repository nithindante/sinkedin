# Final flow

Subjected to change though. 

#### **C. Roast Reactions**
*   This is a core engagement feature. Let's keep it simple and on-brand.
*   **No "Likes":** We use a predefined set of reactions. For V1, let's lock them in:
    1.  `Oof` 😬
    2.  `Cringe` 😖
    3.  `Fired` 🔥
    4.  `Relatable` 🤝
    5.  `Same Hat` 🎩 (for when you've made the exact same mistake)
*   **Logic:** A user can only give one type of reaction per post. If they click "Oof" and then "Cringe," their reaction is updated from "Oof" to "Cringe."

#### **D. SinkedIn Badges**

*   This is for gamification. For V1, badges will be awarded based on simple, automated triggers. No manual awarding.
*   **V1 Badge Triggers:**
    1.  **"First Fuck-up":** Awarded on creating your first post.
    2.  **"Corporate Ghost":** Awarded on creating your first *anonymous* post.
    3.  **"Roast Magnet":** Awarded when your post receives its first 10 reactions (any type).
    4.  **"You're Fired!":** Awarded when your post receives its first "Fired" 🔥 reaction.
    5.  **"Chief Roaster":** Awarded after you have given out 25 reactions to other people's posts.
*   **Logic:** After a relevant action (creating a post, receiving a reaction), a backend function will check if the user qualifies for a new badge.

#### **E. Profile Basics**

*   A user's public-facing page.
*   **Fields:**
    *   `username` (unique, chosen at signup)
    *   `bio` (short, witty, max 160 chars)
    *   `biggestL` ("Biggest Loss") - A dedicated text field to showcase their crowning failure.
*   **Profile Page will display:**
    *   Username, Bio, Biggest L.
    *   A section for their earned "SinkedIn Badges."
    *   A feed of their **non-anonymous** posts.

---

### **2. Backend Flow & System Design**

This is how data will move through our Next.js backend.

1.  **User Signup:**
    *   `POST /api/auth/signup` -> Receives `email`, `password`, `username`.
    *   Validates data (is email/username unique?).
    *   Hashes the password (using `bcrypt`).
    *   Creates a new record in the `Users` table.
    *   Returns a JWT (JSON Web Token) for the user's session.

2.  **User Login:**
    *   `POST /api/auth/login` -> Receives `email`, `password`.
    *   Finds user in `Users` table by email.
    *   Compares submitted password with the hashed password in the DB.
    *   If successful, generates and returns a new JWT.

3.  **Creating a Post:**
    *   `POST /api/posts` -> Requires authentication (checks for valid JWT).
    *   Receives `title`, `body`, `isAnonymous` flag.
    *   Creates a new record in the `Posts` table, linking it to the `userId` from the JWT.
    *   **After saving the post, it triggers the badge logic:**
        *   Check if it's the user's first post -> Award "First Fuck-up".
        *   If `isAnonymous` is true, check if it's their first anonymous post -> Award "Corporate Ghost".

4.  **Viewing the Main Feed:**
    *   `GET /api/posts` -> No authentication required.
    *   Fetches posts from the `Posts` table, sorted by `createdAt` (newest first).
    *   It also **joins** data from the `Users` table to get the author's `username`.
    *   **Crucial Logic:** If a post's `isAnonymous` is `true`, the API response *must not* include the author's real username. It should return a placeholder like "Anonymous".

5.  **Reacting to a Post:**
    *   `POST /api/posts/[postId]/react` -> Requires authentication.
    *   Receives `reactionType` (e.g., "Oof", "Cringe").
    *   Checks if the user has already reacted to this post.
        *   If yes, it **updates** the existing reaction.
        *   If no, it **creates** a new record in the `Reactions` table.
    *   **After saving the reaction, it triggers the badge logic:**
        *   Check if the post owner qualifies for "Roast Magnet" or "You're Fired!".
        *   Check if the reactor qualifies for "Chief Roaster".

---

### **3. V1 Database Schema Design**

This is the blueprint for our database. We'll use a relational model (like PostgreSQL or MySQL), which Prisma (a great tool to use with Next.js) can manage easily.

```sql
-- Users Table: Stores user account information.
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio VARCHAR(160),
    biggestL TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table: Stores all the failure stories.
CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    authorId INT NOT NULL REFERENCES Users(id), -- Foreign Key to Users
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    isAnonymous BOOLEAN DEFAULT false,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reactions Table: Tracks who reacted to which post and how.
CREATE TABLE Reactions (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES Users(id),   -- Who reacted
    postId INT NOT NULL REFERENCES Posts(id),   -- Which post they reacted to
    reactionType VARCHAR(20) NOT NULL,          -- 'Oof', 'Cringe', 'Fired', etc.
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, postId) -- A user can only have one reaction per post
);

-- Badges Table: A static list of all possible badges.
CREATE TABLE Badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- "First Fuck-up"
    description VARCHAR(255) NOT NULL, -- "Awarded for sharing your first story."
    icon_url VARCHAR(255) -- Path to the badge image/icon
);

-- UserBadges Table: A join table linking users to the badges they've earned.
CREATE TABLE UserBadges (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES Users(id),
    badgeId INT NOT NULL REFERENCES Badges(id),
    earnedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, badgeId) -- A user can only earn each badge once
);
```