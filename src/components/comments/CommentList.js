import React from "react";
import Card from "react-bootstrap/Card";

function CommentList({ comments }) {
  return (
    <div style={{ marginTop: "10px" }}>
      {console.log(comments)}
      {comments.map((comment, i) => {
        return (
          <Card key={i}>
            <div>
              <p className="fw-bold">{comment.user.name}</p>
              <p>{comment.comment}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default CommentList;
