import { Search } from "lucide-react";
import { useState } from "react";

interface TaskFilterProps {
    onFilterChange: (filter: string) => void;
    onSearchChange: (query: string) => void;
    onSortChange?: (sort: string) => void;
}

const TaskFilter = ({ onFilterChange, onSearchChange, onSortChange }: TaskFilterProps) => {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("none");

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFilter(value);
        onFilterChange(value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        onSearchChange(value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSort(value);
        onSortChange?.(value);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-6 mb-6 bg-[#fafafa] rounded-xl shadow-sm p-4 border border-gray-100 w-full">

            {/* Search Bar */}
            <div className="w-full sm:w-auto flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                {/* Status / Priority Filter */}
                <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg border border-gray-200 text-sm bg-[#fafafa] hover:border-gray-300 cursor-pointer"
                >
                    <option value="all">All</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Completed</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                </select>

                {/* Sort */}
                <select
                    value={sort}
                    onChange={handleSortChange}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg border border-gray-200 text-sm bg-[#fafafa] hover:border-gray-300 cursor-pointer"
                >
                    <option value="none">Sort By</option>
                    <option value="dueDateAsc">Due Date Asc</option>
                    <option value="dueDateDesc">Due Date Desc</option>
                    <option value="priority">Priority</option>
                </select>
            </div>
        </div>
    );
};

export default TaskFilter;
