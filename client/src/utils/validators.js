export function validateRestaurantField(name, value) {
  if ((name === 'restaurantName' || name === 'address') && !value.trim()) {
    return 'This field is required'
  }
  return ''
}
