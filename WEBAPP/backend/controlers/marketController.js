import { sql} from "../config/idb.js";

export const getTopics=async (req, res) => {
  try {
    const topics = await sql`SELECT topic_name FROM topics2 ORDER BY topic_name`;
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
}


export const getCourses=async (req, res) => {
  try {
    const { topic } = req.query;
    
    const courses = topic 
      ? await sql`
          SELECT *
          FROM courses2
          WHERE type=${topic}
        `
      : await sql`
          SELECT *
        FROM   courses2;
        `;
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
}

export const createCourse=async (req, res) => {
  try {
    const { title, description, topicName } = req.body;
    const userid = req.user.userid;

    const [course] = await sql`
      INSERT INTO courses2 (title, description,userid, type)
      VALUES (${title}, ${description}, ${userid}, ${topicName})
      RETURNING 
        courses2.*,
        (SELECT full_name FROM users2 WHERE userid = ${userid}) as author
    `;

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

export const purchaseCourses=async (req, res) => {
  try {
    const { courseid } = req.params;
    const buyerid = req.user.userid;

    // Check if course exists
    const [course] = await sql`
      SELECT *
      FROM courses2
      WHERE courseid = ${courseid}
    `;
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is trying to buy their own course
    if (course.userid === buyerid) {
      return res.status(400).json({ error: 'You cannot purchase your own course' });
    }

    // Check if already purchased
    const [existingPurchase] = await sql`
      SELECT * FROM course_purchases2
      WHERE courseid = ${courseid} AND userid = ${buyerid}
    `;

    if (existingPurchase) {
      return res.status(400).json({ error: 'Course already purchased' });
    }

    // Get buyer's balance
    const [buyer] = await sql`
      SELECT * FROM skillcoin2 WHERE userid = ${buyerid}
    `;
//if coins not enough 
    if (buyer.balance < course.price) {
      return res.status(400).json({ error: 'Insufficient SkillCoins balance' });
    }

    // Begin transaction
    await sql.begin(async (sql) => {
      // Deduct coins from buyer
      await sql`
        UPDATE skillcoin2
        SET balance = balance - ${course.price}
        WHERE userid = ${buyerid}
      `;

      // Add coins to seller
    /*  await sql`
        UPDATE users 
        SET skill_coins = skill_coins + ${course.price}
        WHERE id = ${course.seller_id}
      `;
      */

      // Record transaction
      /*
      await sql`
        INSERT INTO skill_coin_transactions (
          sender_id, receiver_id, amount, transaction_type, course_id, description
        ) VALUES (
          ${buyerId}, ${course.seller_id}, ${course.price}, 'course_purchase', ${courseId}, 
          ${'Purchase of course: ' + course.title}
        )
      `;
      */

      // Create purchase record
      await sql`
        INSERT INTO course_purchases2 (courseid, userid)
        VALUES (${courseid}, ${buyerid})
      `;
    });

    // Get updated balance
    const [updatedUser] = await sql`
      SELECT * FROM skillcoin2 WHERE userid = ${buyerid}
    `;

    res.status(201).json({ 
      message: 'Course is purchased successfully',
      newBalance: updatedUser.balance
    });
  } catch (error) {
    console.error('Error purchasing course:', error);
    res.status(500).json({ error: 'Failed to purchase course' });
  }
};


export const getPurchasedCourses=async (req, res) => {
  try {
    const userid = req.user.userid;
    
    const purchases = await sql`
      SELECT 
        c.*,
        u.full_name as author,
        p.purchase_date
      FROM course_purchases2 p
      JOIN courses2 c ON p.courseid = c.courseid
      JOIN users2 u ON c.userid = u.userid
      WHERE p.userid = ${userid}
      ORDER BY p.purchase_date DESC
    `;
    
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
    res.status(500).json({ error: 'Failed to fetch purchased courses' });
  }
};


export const getSkillCoins=async (req, res) => {
  try {
    const userid = req.user.userid;
    
    const user = await sql`
      SELECT * FROM skillcoin2 WHERE userid = ${userid}
    `;
    
    if (user.length===0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ balance:user[0].balance});
  } catch (error) {
    console.error('Error fetching skill coin balance:', error);
    res.status(500).json({ error: 'Failed to fetch skill coin balance' });
  }
};

export const getUserPosted=async (req, res) => {
  try {
    const userid = req.user.userid;
    
    const courses = await sql`
      SELECT 
        c.*,
        u.full_name as author
      FROM courses2 c
      JOIN users2 u ON c.userid = u.userid
      WHERE c.userid = ${userid}
      ORDER BY c.createdAt DESC
    `;
    res.json(courses);
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ error: 'Failed to fetch user courses' });
  }
};