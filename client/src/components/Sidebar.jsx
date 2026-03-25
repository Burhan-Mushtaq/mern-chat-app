const Sidebar = () => {
    return(
        <div className="w-1/4 bg-gray-900 text-white flex flex-col">

            <div className="p-4 border-b border-b-gray-700">
                    <h2 className="text-lg font-bold">Chats</h2>
            </div>

            <div className="p-2">
                <input 
                    type="text"
                    placeholder="Serach"
                    className="w-full p-2 rounded bg-gray-800 outline-none"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {[1,2,3].map((user) => (
                    <div
                    key={user}
                    className="p-3 hover:bg-gray-800 cursor-pointer"
                    >
                        User {user}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;