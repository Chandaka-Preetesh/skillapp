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
    const { title, description, topicName ,price,duration} = req.body;
    const userid = req.user.userid;

    const [course] = await sql`
      INSERT INTO courses2 (title, description,userid, type,price,duration)
      VALUES (${title}, ${description}, ${userid}, ${topicName},${price},${duration})
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
    if(!buyer ) {
      res.status(400).json({ error: 'Buyer id invalid ' } );
    }
//if coins not enough 
    let buyer_balance=Number(buyer.balance);
    let course_price=Number(course.price)
    if ( buyer_balance<course_price  ) {
      return res.status(400).json({ error: 'Insufficient SkillCoins balance' });
    }

    // Begin transaction
      // Deduct coins from buyer
      await sql`
        UPDATE skillcoin2
        SET balance = balance - ${course.price}
        WHERE userid = ${buyerid}
      `;

      // Create purchase record
      await sql`
        INSERT INTO course_purchases2 (courseid, userid)
        VALUES (${courseid}, ${buyerid})
      `;

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


export const getPurchasedCourses = async (req, res) => {
  try {
    const userid = req.user.userid;
    
    const coursesOwned = await sql`
      SELECT 
        c.*,
        u.full_name as author,
        p.purchase_date,
        cpd.rating,
        cpd.is_liked
      FROM course_purchases2 p
      JOIN courses2 c ON p.courseid = c.courseid
      JOIN users2 u ON c.userid = u.userid
      LEFT JOIN course_post_details2 cpd ON cpd.courseid = p.courseid AND cpd.userid = p.userid
      WHERE p.userid = ${userid}
      ORDER BY p.purchase_date DESC
    `;
    
    res.json(coursesOwned);
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

export const updateCourseRating =async (req,res)=> {
    try {
         const { courseid, rating } = req.body;
        const userid = req.user.userid;

        const course_post_details2 = await sql`
        INSERT INTO course_post_details2 (courseid, userid, rating)
         VALUES (${courseid}, ${userid}, ${rating})
           ON CONFLICT (courseid, userid)
           DO UPDATE SET rating = ${rating}
         RETURNING *;
`;

res.json(course_post_details2);

    }
    catch (error) {
      console.log("error occurecd while updating ratings ");
      res.status(500).json({error:"failed to update rating "});
    }
}

export const toggleCourseLike =async (req,res)=>{
          try {
         const { courseid,isLiked} = req.body;
        const userid = req.user.userid;

        const course_post_details2 = await sql`
        INSERT INTO course_post_details2 (courseid, userid)
         VALUES (${courseid}, ${userid})
           ON CONFLICT (courseid, userid)
           DO UPDATE SET is_liked = ${isLiked}
         RETURNING *;
`;
res.json(course_post_details2);

    }
    catch (error) {
      console.log("error occurecd while updating ratings ");
      res.status(500).json({error:"failed to update rating "});
    }
}