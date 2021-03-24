const submittedLessThan2Days = (createdAt: Date) => {
  const twoDaysBefore = new Date();
  twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

  return createdAt >= twoDaysBefore;
};

export default submittedLessThan2Days;
