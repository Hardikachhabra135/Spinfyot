const { sequelize, Admin, Counsellor, Message } = require('./models');

async function test() {
  await sequelize.sync();
  
  const admin = await Admin.findOne();
  if (!admin) {
    console.log("No admins found");
    return;
  }
  
  const counsellor = await Counsellor.findOne();
  if (!counsellor) {
    console.log("No counsellors found");
    return;
  }
  
  console.log(`Admin ID: ${admin.id}, Counsellor ID: ${counsellor.id}`);
  
  // 1. Send from Admin to Counsellor
  console.log("Creating message from Admin to Counsellor...");
  const msg1 = await Message.create({
    adminId: admin.id,
    counsellorId: counsellor.id,
    sender: 'Admin',
    content: 'Hello from Admin',
    isRead: false
  });
  
  console.log("Message created with adminId:", msg1.adminId, "counsellorId:", msg1.counsellorId);
  
  // 2. Fetch by Counsellor
  const messages = await Message.findAll({
    where: { adminId: admin.id, counsellorId: counsellor.id }
  });
  
  console.log(`Counsellor fetched ${messages.length} messages.`);
  messages.forEach(m => console.log(`[${m.sender}] ${m.content} (adminId=${m.adminId}, counsellorId=${m.counsellorId})`));
}

test().catch(console.error).finally(() => process.exit(0));
