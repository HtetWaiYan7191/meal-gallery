const countComments = (commentTitle, comments) => {
  commentTitle.textContent = `Comments (${comments.length})`;
};

export default countComments;