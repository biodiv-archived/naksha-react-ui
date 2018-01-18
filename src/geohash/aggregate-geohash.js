const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";


module.exports = function(key, level, bin_size) {
  bin_size = bin_size ? bin_size : 16/2**(1-key.length&1)/4**level;
  var key_except_last = key.slice(0, -1);
  var binned_char_at = ~~(BASE32.indexOf(key.slice(-1)) / bin_size);
  return {
    start: key_except_last + BASE32[bin_size * binned_char_at],
    end: key_except_last + BASE32[bin_size * (binned_char_at + 1) - 1]
  }
};
