const Club = require('../models/club.model');
const User = require('../models/user.model');

const createClubAndLinkAdmin = async (clubData, adminId) => {
    try {
        console.log('Creating club with data:', clubData);
        console.log('Admin ID:', adminId);

        // Create the club
        const club = new Club({
            ...clubData,
            admin: adminId
        });

        // Save the club
        await club.save();
        console.log('Club created successfully:', club._id);

        // Update the user with clubId
        const updatedUser = await User.findByIdAndUpdate(
            adminId,
            { clubId: club._id },
            { new: true }
        );
        
        if (!updatedUser) {
            throw new Error('Failed to update user with club ID');
        }
        
        console.log('User updated with club ID:', updatedUser._id, updatedUser.clubId);

        return club;
    } catch (error) {
        console.error('Error in createClubAndLinkAdmin:', error);
        // If club was created but user update failed, delete the club
        if (error.message.includes('Failed to update user')) {
            await Club.findByIdAndDelete(club._id);
            console.log('Deleted orphaned club due to failed user update');
        }
        throw error;
    }
};

module.exports = {
    createClubAndLinkAdmin
}; 