
// Get Cart by User ID Route
router.post('/get-cart', async (req, res) => {
    try {
      const { cartId } = req.body;  //use cartId, not userId
      
      const cart = await Cart.findOne({ cartId }).populate('productsInCart.productId');  // useing .populate() method to get full product details
      
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found for this user' });
      }
      
      // Return cart including productsInCart
      res.status(200).json({ success: true, cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
    }
  });

// Update Cart Quantity Route
router.put('/update-quantity', async (req, res) => {
    const { cartId, productId, productQty } = req.body;
  
    if (!cartId || !productId || typeof productQty !== 'number') {
      return res.status(400).json({ message: 'cartId, productId, and a valid productQty are required.' });
    }
  
    try {
      const cart = await Cart.findOne({ cartId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found.' });
      }
      // Here we are changing productId to a string to get the productId comparison to work correctly.
      const product = cart.productsInCart.find(item => item.productId.toString() === productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found in the cart.' });
      }
  
      product.productQty = productQty;
      await cart.save();
  
      res.status(200).json({ success: true, message: 'Quantity updated successfully.' });
    } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({ message: 'An error occurred while updating the quantity.' });
    }
  });

// Delete Item from Cart Route
router.post('/delete-item', async (req, res) => {
    // include cartId in the query to target the correct cart
    const {cartId, productId } = req.body; // deleted cardId  or productId
  
    if (!cartId || !productId) {
      return res.status(400).json({ message: 'cartId and productId are required.' });
    }
  
    try {
      const result = await Cart.updateOne(
        {cartId}, // ensure correct cart is targeted
        { $pull: { productsInCart: { productId } } }
      );
      // console.log(result);
  
      if (result.modifiedCount > 0) {
        res.status(200).json({ success: true, message: 'Item deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Item not found in the cart.' });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'An error occurred while deleting the item.' });
    }
  });
