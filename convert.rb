#!/usr/bin/env ruby
require 'bundler/setup'
require 'json/stream'
require 'json'
require 'pry'


# fp = File.open('trunc.json')
fp = File.open('clues.json')
puts 'parsing…'
parsed = JSON::Stream::Parser.parse(fp)
puts 'parsed!'


puts 'grouping…'
grouped = parsed
  .group_by {|el| el['air_date'] }
  .inject({}) do |memo, (air_date, clues)|
      memo[air_date] = clues
        .group_by {|el| el['round'] }
        .inject({}) do |memo_2, (round, clues_2)|
          memo_2[round] = clues_2
            .group_by {|el| el['category']}
            .inject({}) do |memo_3, (category, clues_3)|
              memo_3[category] = clues_3
                .group_by{|el| el['value']}
                .inject({}) do |memo_4, (value, clues_4)|
                  new_key = value.nil? ? -1 : value.gsub(/\$/, '')
                  memo_4[new_key] = clues_4.map{|el|
                      [ el['question'].gsub(/^'|'$/, ''), el['answer'] ]
                  }.first
                  memo_4
              end
              memo_3
            end
          memo_2
        end
      memo
  end
  .sort
puts 'grouped!'

puts 'writing…'
out = File.open('grouped.json', 'w+')
out.write(grouped.to_json)
puts 'done!'
