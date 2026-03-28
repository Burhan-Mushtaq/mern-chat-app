const users = [
  { id: "user1", name: "hadi" },
  { id: "user2", name: "wahid" },
  { id: "user3", name: "huzaif" },
];

const Sidebar = ({ setSelectedUser }) => {
  return (
    <div className="w-1/4 bg-gray-900 text-white">
      <h2 className="p-4 font-bold">Users</h2>

      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => {
            console.log("Clicked:", user); // 👈 DEBUG
            setSelectedUser(user);
          }}
          className="p-3 hover:bg-gray-800 cursor-pointer"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;