import supabase from "./supabaseClient";

//ดึงข้อมูลห้องพักทั้งหมด
async function getRooms() {
    const { data, error } = await supabase
        .from("rooms") // เชื่อมกับตาราง rooms
        .select("*"); // ดึงทุกคอลัมน์

    if (error) console.error("Error fetching rooms:", error);
    else console.log("Rooms data:", data);
}

getRooms();


//ดึงเฉพาะห้องที่ว่าง (available)
async function getAvailableRooms() {
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("status", "available"); // ดึงเฉพาะห้องที่ status = 'available'

    if (error) console.error("Error fetching rooms:", error);
    else console.log("Available rooms:", data);
}

getAvailableRooms();


//เพิ่มห้องพักใหม่
async function addRoom() {
    const { data, error } = await supabase
        .from("rooms")
        .insert([
            { room_number: "104", price: 6000, status: "available", description: "ห้องมาตรฐาน", size: "30 ตร.ม.", floor: 2 }
        ]);

    if (error) console.error("Error adding room:", error);
    else console.log("Room added:", data);
}

addRoom();


//เปลี่ยนสถานะห้องเป็น booked
async function updateRoomStatus(roomId) {
    const { data, error } = await supabase
        .from("rooms")
        .update({ status: "booked" }) // อัปเดตสถานะห้อง
        .eq("id", roomId); // เฉพาะห้องที่มี id ตรงกัน

    if (error) console.error("Error updating room:", error);
    else console.log("Room updated:", data);
}

updateRoomStatus("room-id-123"); // ใส่ room ID ที่ต้องการเปลี่ยนสถานะ


//ลบห้องพัก
async function deleteRoom(roomId) {
    const { data, error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", roomId); // ลบเฉพาะห้องที่ ID ตรงกัน

    if (error) console.error("Error deleting room:", error);
    else console.log("Room deleted:", data);
}

deleteRoom("room-id-123"); // ใส่ ID ห้องที่ต้องการลบ


