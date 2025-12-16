import { FilterCriteria } from '@/shared/types';
import { useState } from 'react';
import FilterMenu from './FilterMenu';

// Example of how to use the FilterMenu component
const FilterMenuExample = () => {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    userId: '',
    filters: {},
  });

  const handleFilterChange = (newFilter: FilterCriteria) => {
    console.log('Filter changed:', newFilter);
    setFilterCriteria(newFilter);

    // Example of the expected JSON output:
    /*
    {
      "filters": {
        "type": "Customer", // or { "in": ["Customer", "Provider"] } for multiple
        "dob": {
          "gte": "1990-01-01",
          "lte": "2000-12-31"
        },
        "transactions": {
          "some": {
            "OR": [
              {
                "type": "Expense",
                "amount": {
                  "gte": 1,
                  "lte": 80000
                }
              },
              {
                "type": "Income",
                "amount": {
                  "gte": 1,
                  "lte": 1000
                }
              }
            ]
          }
        }
      }
    }
    */
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Partner Filters</h2>
        <FilterMenu onFilterChange={handleFilterChange} filterCriteria={filterCriteria} />
      </div>

      {/* Display current filter criteria for debugging */}
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-medium mb-2">Current Filter Criteria:</h3>
        <pre className="text-sm overflow-x-auto">{JSON.stringify(filterCriteria, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FilterMenuExample;
