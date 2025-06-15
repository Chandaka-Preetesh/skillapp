import { sql} from "../config/idb.js";

export const getDoubts = async (req, res) => {
  try {
    const { topic } = req.query;
    const userid = req.user.userid; // The user ID from the request
    
    const doubts = topic 
      ? await sql`
          SELECT * 
          FROM doubts2 
          WHERE topic = ${topic}
        `
      : await sql`
          SELECT *
          FROM doubts2 
        `;
    
    res.json(doubts);
  } catch (error) {
    console.error('Error fetching doubts', error);
    res.status(500).json({ error: 'Failed to fetch doubts' });
  }
};

export const createDoubt =async (req, res) => {
  try {
    const { title,question,topic} = req.body;
    const userid = req.user.userid;

    const [doubts] = await sql`
      INSERT INTO doubts2 (title, question,userid, topic)
      VALUES (${title}, ${question}, ${userid}, ${topic})
      RETURNING 
        doubts2.*,
        (SELECT full_name FROM users2 WHERE userid = ${userid}) as author
    `;
    res.status(201).json(doubts);
  } catch (error) {
    console.error('Error creating doubt', error);
    res.status(500).json({ error: 'Failed to create doubt ' });
  }
}

export const getUserDoubts=async (req, res) => {
  try {
    const userid = req.user.userid;
    
    const doubts= await sql`
      SELECT 
        d.*,
        u.full_name as author
      FROM doubts2 d
      JOIN users2 u ON d.userid = u.userid
      WHERE d.userid = ${userid}
      ORDER BY d.createdAt DESC
    `;
    res.json(doubts);
  } catch (error) {
    console.error('Error fetching user  doubts:', error);
    res.status(500).json({ error: 'Failed to fetch user doubts' });
  }
};
export const getReplies = async(req, res) => {     
    try {          
        const {doubtid} = req.params;          
        const userid = req.user.userid;         
        
        const replies = await sql`      
            SELECT      
                d.doubt_replies_id,     
                d.userid AS reply_userid,     
                d.reply,     
                d.createdat,     
                u.full_name AS author,     
                COALESCE(r.rating, 0) AS rating,     
                COALESCE(r.is_liked, false) AS is_liked   
            FROM doubt_replies2 d   
            JOIN users2 u ON d.userid = u.userid   
            LEFT JOIN reply_details2 r      
                ON r.doubt_replies_id = d.doubt_replies_id AND r.userid = ${userid}   
            WHERE d.doubtid = ${doubtid}   
            ORDER BY d.createdat ASC; 
        `          
        
        res.json(replies);     
    }     
    catch (error) {         
        console.log("error occured while fetching replies", error);         
        res.status(500).json({error:"failed to fetch replies of doubt"});     
    }  
}

export const addReply =async(req,res)=>{
    try {
        const {doubtid}=req.params;
        const userid=req.user.userid;
        const {reply}=req.body;
        const  newReply= await sql `INSERT INTO doubt_replies2 (doubtid,userid,reply) VALUES (${doubtid},${userid},${reply})
        RETURNING *
        `
        res.json(newReply[0]);
    }
    catch (error) {
          console.log("error occured while posting reply")
        res.status(500).json({error:"failed to post reply of doubt"});
    }
}


export const updateReplyRating =async (req,res)=> {
    try {
         const { replyid, rating } = req.body;
        const userid = req.user.userid;

        const reply_details = await sql`
        INSERT INTO reply_details2 (doubt_replies_id, userid, rating)
         VALUES (${replyid}, ${userid}, ${rating})
           ON CONFLICT (doubt_replies_id, userid)
           DO UPDATE SET rating = ${rating}
         RETURNING *;
`;

res.json(reply_details);

    }
    catch (error) {
      console.log("error occurecd  reply while updating ratings ");
      res.status(500).json({error:"failed to reply update rating "});
    }
}

export const toggleReplyLike =async (req,res)=>{
          try {
         const { replyid,isLiked} = req.body;
        const userid = req.user.userid;

        const reply_details= await sql`
        INSERT INTO reply_details2 (doubt_replies_id, userid)
         VALUES (${replyid}, ${userid})
           ON CONFLICT (doubt_replies_id, userid)
           DO UPDATE SET is_liked = ${isLiked}
         RETURNING *;
`;
res.json(reply_details);

    }
    catch (error) {
      console.log("error occurecd while updating reply ratings ");
      res.status(500).json({error:"failed to update reply  rating "});
    }
}

export const getAverageReplyRating = async(req,res)=> {
  try {
  const { replyid } = req.query;

  const result = await sql`
    SELECT ROUND(avg(rating),1) as "avgRating"
    FROM reply_details2 
    WHERE doubt_replies_id = ${replyid} AND rating != 0
  `;

  let averageRating=0;
    if(result.length==0) {return res.json(averageRating);}
    averageRating = result[0].avgRating; 

  res.json(averageRating );
} catch (error) {
  console.log("Error while getting average rating:", error.message);
  res.status(500).json({ error: "Failed to get average reply rating" });
}
}

