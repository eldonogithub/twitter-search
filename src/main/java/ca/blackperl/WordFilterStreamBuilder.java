/*
 * Copyright 2007 Yusuke Yamamoto
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ca.blackperl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import twitter4j.FilterQuery;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;

/**
 * <p>
 * This is a code example of Twitter4J Streaming API - filter method support.<br>
 * Usage: java twitter4j.examples.stream.PrintFilterStream [follow(comma
 * separated numerical user ids)] [track(comma separated filter terms)]<br>
 * </p>
 * 
 * @author Yusuke Yamamoto - yusuke at mac.com
 */
public final class WordFilterStreamBuilder
{
    static final Log log = LogFactory.getLog(WordFilterStreamBuilder.class);

    private static final int TimeToRunInSeconds = 60;

    private String[] args;

    /**
     * Main entry of this application.
     * 
     * @param args
     *            follow(comma separated user ids) track(comma separated filter
     *            terms)
     * @throws twitter4j.TwitterException
     */
    public WordFilterStreamBuilder(String[] args)
    {
        this.args = args;
        // Check commandline parameters
        if (args.length < 1)
        {
            System.out
                    .println("Usage: java twitter4j.examples.PrintFilterStream [follow(comma separated numerical user ids)] [track(comma separated filter terms)]");
            System.exit(-1);
        }
    }
    
    public void main()
    {
        // create the twitter search listener
        PhraseListener listener = new PhraseListener(args);

        // Connect to twitter.
        final TwitterStream twitterStream = new TwitterStreamFactory()
                .getInstance();
        
        // The listener to the twitter connection
        twitterStream.addListener(listener);
        
        // Build a search configuration
        ArrayList<Long> follow = new ArrayList<Long>();
        ArrayList<String> track = new ArrayList<String>();
        for (String arg : args)
        {
            if (isNumericalArgument(arg))
            {
                for (String id : arg.split(","))
                {
                    follow.add(Long.parseLong(id));
                }
            }
            else
            {
                track.addAll(Arrays.asList(arg.split(",")));
            }
        }
        long[] followArray = new long[follow.size()];
        for (int i = 0; i < follow.size(); i++)
        {
            followArray[i] = follow.get(i);
        }
        String[] trackArray = track.toArray(new String[track.size()]);

        // filter() method internally creates a thread which manipulates
        // TwitterStream and calls the listener methods continuously.
        
        // pass the search configuration to the twitter library to start the search
        twitterStream.filter(new FilterQuery(0, followArray, trackArray));

        // Create a timer
        final Timer timer = new Timer();

        // Create a task to run every minute, starting in one minute.
        TimerTask summaryTask = new SummaryTask(listener, timer, twitterStream);
        timer.schedule(summaryTask, TimeToRunInSeconds * 1000, TimeToRunInSeconds * 1000);
    }

    private static boolean isNumericalArgument(String argument)
    {
        String args[] = argument.split(",");
        boolean isNumericalArgument = true;
        for (String arg : args)
        {
            try
            {
                Integer.parseInt(arg);
            }
            catch (NumberFormatException nfe)
            {
                isNumericalArgument = false;
                break;
            }
        }
        return isNumericalArgument;
    }
}
