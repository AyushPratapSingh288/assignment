const Slot = require('../models/slot-model');
const { viewSlots } = require('../controllers/student-controller'); 
jest.mock('../models/slot-model');

describe('viewSlots', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { professorId: '12345' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    it('should fetch available slots for a given professor and return them', async () => {
        const mockSlots = [
            { id: 1, professor: '12345', isBooked: false },
            { id: 2, professor: '12345', isBooked: false },
        ];

        Slot.find.mockResolvedValue(mockSlots);

        await viewSlots(req, res);

        expect(Slot.find).toHaveBeenCalledWith({ professor: '12345', isBooked: false });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSlots);
    });

    it('should handle errors gracefully and return a 500 status', async () => {
        const mockError = new Error('Database error');
        Slot.find.mockRejectedValue(mockError);

        await viewSlots(req, res);

        expect(Slot.find).toHaveBeenCalledWith({ professor: '12345', isBooked: false });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error fetching slots');
    });
});
