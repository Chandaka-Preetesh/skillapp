import { sql } from './idb.js';


// Link Google account to existing user or create new user
export const linkGoogleAccount = async ({ email, full_name, google_id }) => {
  try {
    // Check if user already exists
    const isPresent = await sql`
      SELECT userid FROM users2 WHERE email= ${email};
    `;
    let userid;
    if (isPresent.length > 0) {
      // User exists: update last login
      userid = isPresent[0].userid;
      await sql`
        UPDATE users2
        SET lastlogin = NOW()
        WHERE userid = ${userid};
      `;
    } else {
      // User doesn't exist: insert new
      const inserted = await sql`
        INSERT INTO users2 (email, full_name, googleid, lastlogin)
        VALUES (${email}, ${full_name}, ${google_id}, NOW())
        RETURNING userid;
      `;
      userid = inserted[0].userid;
    }
    return { userid, email, full_name, google_id };
  } catch (error) {
    console.log("Error while creating or updating Google account:", error.message);
    throw error;
  }
};
