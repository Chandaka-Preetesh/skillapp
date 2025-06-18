import { sql} from "../config/idb.js";

export const getUserInfo =async (req,res)=>{
    try {
        const userid=req.user.userid;
        const reponse =await sql`
        SELECT full_name as username,email
        FROM users2
        WHERE userid=${userid}
        `
        const coinRes=await sql`
        SELECT balance
        FROM skillcoin2
        WHERE userid=${userid}
        `
        const reponseObject={
          username:reponse[0].username,
          email:reponse[0].email,
          skillcoins:coinRes[0].balance
        };
       res.json(reponseObject);
    }
    catch (error ){
        console.log("error occured while geting profile user details");
        res.status(500).json ({error:"unable retrive user detailss"});
    }
};
export const getStats = async (req, res) => {
  try {
    const userid = req.user.userid;

    const totalCoursesResult = await sql`
      SELECT COUNT(courseid) AS totalCourses
      FROM courses2
      WHERE userid = ${userid}
    `;

    const avgCourseRatingResult = await sql`
      SELECT AVG(rating) AS avgCourseRating
      FROM course_post_details2
      WHERE courseid IN (
        SELECT courseid FROM courses2 WHERE userid = ${userid}
      ) AND rating != 0
    `;

    const totalDoubtsResult = await sql`
      SELECT COUNT(doubt_replies_id) AS totalDoubts
      FROM doubt_replies2
      WHERE userid = ${userid}
    `;

    const avgDoubtRatingResult = await sql`
      SELECT AVG(rating) AS avgDoubtRating
      FROM reply_details2
      WHERE doubt_replies_id IN (
        SELECT doubt_replies_id FROM doubt_replies2 WHERE userid = ${userid}
      ) AND rating != 0
    `;

    res.json({
      totalCourses: totalCoursesResult[0].totalCourses || 0,
      avgCourseRating: parseFloat(avgCourseRatingResult[0].avgCourseRating || 0).toFixed(1),
      totalDoubts: totalDoubtsResult[0].totalDoubts || 0,
      avgDoubtRating: parseFloat(avgDoubtRatingResult[0].avgDoubtRating || 0).toFixed(1),
    });

  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({ error: "Error while getting stats" });
  }
};


export const getStreak=async (req,res)=> {
  try {
    const userid=req.user.userid;
    const reponse=await sql`
    SELECT DATE(time) as date, COUNT(*) as count
    FROM recent_activity2
    WHERE userid = ${userid}
  AND time >= NOW() - INTERVAL '2 months'
  GROUP BY date
    `
    res.json(reponse);
  }
  catch(error) {
    console.log("error while fecthinh recent activity data for streak");
    res.status(500).json({error:"error while fetching data for streak"});
  }
}

export const getRecentActivity=async(req,res)=>{
    try {
      const userid=req.user.userid;
      const response=await sql`
      SELECT type,activity
      FROM recent_activity2
      WHERE userid=${userid}
      `
      res.json(response);
    }
    catch(error ) {
      console.log("error while getting recent activity");
      res.status(500).json({error:"error while fetching recent activity"});
    }
}

export const getEarnings=async(req,res)=>{
    try {
      const userid=req.user.userid;
   const  reponse=  await sql`
      SELECT 
   DATE_TRUNC('month', transaction_date) AS month,
    SUM(amount) AS total_received
  FROM  course_transactions2
WHERE ownerid = ${userid}
GROUP BY month
ORDER BY  month DESC;
      `
      res.json(reponse);
    }
    catch(error) {
        console.log("error while fetching monthly earning");
        res.status(500).json({error:"unable to fetch monthly earnings"});
    }
}