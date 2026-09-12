const { sequelize, Message } = require('./models');

async function test() {
  try {
    const result = await Message.update(
      { isRead: true },
      { where: { adminId: "1", counsellorId: 1, sender: 'Admin', isRead: false } }
    );
    console.log("Update success:", result);
  } catch (error) {
    console.error("Update failed:", error);
  }
}

test().finally(() => process.exit(0));
